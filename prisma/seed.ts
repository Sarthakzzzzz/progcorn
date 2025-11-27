import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10)
  const [admin, user] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@prhub.dev' },
      update: {},
      create: { username: 'admin', email: 'admin@prhub.dev', passwordHash, role: 'ADMIN' }
    }),
    prisma.user.upsert({
      where: { email: 'user@prhub.dev' },
      update: {},
      create: { username: 'johndoe', email: 'user@prhub.dev', passwordHash, role: 'USER' }
    })
  ])

  const categories = await prisma.$transaction([
    prisma.category.upsert({ where: { slug: 'blog' }, update: {}, create: { name: 'Blog', slug: 'blog' } }),
    prisma.category.upsert({ where: { slug: 'repo' }, update: {}, create: { name: 'Repo', slug: 'repo' } }),
    prisma.category.upsert({ where: { slug: 'cheatsheet' }, update: {}, create: { name: 'Cheatsheet', slug: 'cheatsheet' } }),
    prisma.category.upsert({ where: { slug: 'course' }, update: {}, create: { name: 'Course', slug: 'course' } }),
    prisma.category.upsert({ where: { slug: 'docs' }, update: {}, create: { name: 'Docs', slug: 'docs' } }),
    prisma.category.upsert({ where: { slug: 'video' }, update: {}, create: { name: 'Video', slug: 'video' } }),
  ])

  const tags = await prisma.$transaction([
    prisma.tag.upsert({ where: { slug: 'dsa' }, update: {}, create: { name: 'DSA', slug: 'dsa' } }),
    prisma.tag.upsert({ where: { slug: 'web' }, update: {}, create: { name: 'Web', slug: 'web' } }),
    prisma.tag.upsert({ where: { slug: 'python' }, update: {}, create: { name: 'Python', slug: 'python' } }),
    prisma.tag.upsert({ where: { slug: 'cpp' }, update: {}, create: { name: 'C++', slug: 'cpp' } }),
    prisma.tag.upsert({ where: { slug: 'frontend' }, update: {}, create: { name: 'Frontend', slug: 'frontend' } }),
    prisma.tag.upsert({ where: { slug: 'backend' }, update: {}, create: { name: 'Backend', slug: 'backend' } }),
    prisma.tag.upsert({ where: { slug: 'system-design' }, update: {}, create: { name: 'System Design', slug: 'system-design' } }),
  ])

  const [blog, repo] = categories
  const [webTag, backendTag] = [tags[1], tags[5]]

  const resource1 = await prisma.resource.create({
    data: {
      title: 'Awesome Web Dev Blog',
      url: 'https://example.com/web-blog',
      description: 'A curated blog about modern web development.',
      authorId: user.id,
      categoryId: blog.id,
      status: 'APPROVED',
      tags: { create: [{ tagId: webTag.id }] }
    }
  })

  const resource2 = await prisma.resource.create({
    data: {
      title: 'Backend Best Practices',
      url: 'https://example.com/backend-best-practices',
      description: 'Collection of backend engineering practices.',
      authorId: admin.id,
      categoryId: repo.id,
      status: 'APPROVED',
      tags: { create: [{ tagId: backendTag.id }] }
    }
  })

  await prisma.comment.create({ data: { content: 'Great find!', userId: user.id, resourceId: resource1.id } })
  await prisma.upvote.create({ data: { resourceId: resource1.id, userId: user.id } })
  const collection = await prisma.collection.create({ data: { name: 'My Picks', description: 'Favorites', userId: user.id } })
  await prisma.collectionItem.create({ data: { collectionId: collection.id, resourceId: resource1.id } })

  console.log('Seed completed')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
