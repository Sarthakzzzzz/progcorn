import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
async function main() {
  const passwordHash = await bcrypt.hash('password123!', 10)
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

// Add example platforms & contests
async function seedPlatformsAndContests() {
  // Upsert a few example platforms
  const platforms = await prisma.$transaction([
    prisma.platform.upsert({ where: { externalId: 1 }, update: { name: 'codeforces.com' }, create: { externalId: 1, name: 'codeforces.com', icon: 'https://clist.by/media/sizes/64x64/img/resources/codeforces_com.png', short: 'Codeforces', nAccounts: 10_000_000, nContests: 800 } }),
    prisma.platform.upsert({ where: { externalId: 2 }, update: { name: 'leetcode.com' }, create: { externalId: 2, name: 'leetcode.com', icon: 'https://clist.by/media/sizes/64x64/img/resources/leetcode_com.png', short: 'LeetCode', nAccounts: 25000000, nContests: 400 } }),
    prisma.platform.upsert({ where: { externalId: 3 }, update: { name: 'atcoder.jp' }, create: { externalId: 3, name: 'atcoder.jp', icon: 'https://clist.by/media/sizes/64x64/img/resources/atcoder_jp.png', short: 'AtCoder', nAccounts: 2000000, nContests: 1200 } }),
  ])

  // Create a few contests for these platforms (externalId must be unique integers)
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  await prisma.contest.upsert({
    where: { externalId: 1001 },
    update: {
      name: 'CF Round – Example',
      url: 'https://codeforces.com/contest/1001',
      platform: 'codeforces.com',
      startAt: tomorrow,
      endAt: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000),
      duration: 3 * 60 * 60,
      nProblems: 6,
      nStatistics: 1200,
      parsedAt: now,
    },
    create: {
      externalId: 1001,
      name: 'CF Round – Example',
      url: 'https://codeforces.com/contest/1001',
      platform: 'codeforces.com',
      startAt: tomorrow,
      endAt: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000),
      duration: 3 * 60 * 60,
      nProblems: 6,
      nStatistics: 1200,
      parsedAt: now,
    }
  })

  await prisma.contest.upsert({
    where: { externalId: 1002 },
    update: {
      name: 'LeetCode Weekly - Example',
      url: 'https://leetcode.com/contest/1002',
      platform: 'leetcode.com',
      startAt: nextWeek,
      endAt: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000),
      duration: 2 * 60 * 60,
      nProblems: 4,
      nStatistics: 800,
      parsedAt: now,
    },
    create: {
      externalId: 1002,
      name: 'LeetCode Weekly - Example',
      url: 'https://leetcode.com/contest/1002',
      platform: 'leetcode.com',
      startAt: nextWeek,
      endAt: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000),
      duration: 2 * 60 * 60,
      nProblems: 4,
      nStatistics: 800,
      parsedAt: now,
    }
  })

  await prisma.contest.upsert({
    where: { externalId: 1003 },
    update: {
      name: 'AtCoder Beginner – Example',
      url: 'https://atcoder.jp/contests/1003',
      platform: 'atcoder.jp',
      startAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      duration: 2 * 60 * 60,
      nProblems: 4,
      nStatistics: 600,
      parsedAt: now,
    },
    create: {
      externalId: 1003,
      name: 'AtCoder Beginner – Example',
      url: 'https://atcoder.jp/contests/1003',
      platform: 'atcoder.jp',
      startAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      duration: 2 * 60 * 60,
      nProblems: 4,
      nStatistics: 600,
      parsedAt: now,
    }
  })

  console.log('Sample platforms and contests seeded')
}

// run the extra seeding logic after the original seed completes
main().then(async () => {
  try {
    await seedPlatformsAndContests()
  } catch (err) {
    console.warn('Extra seed failed:', err)
  } finally {
    await prisma.$disconnect()
    process.exit(0)
  }
})
