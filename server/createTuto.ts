/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */

'use server'

import { Level, Role } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma/prisma'
import options from '@/app/api/auth/[...nextauth]/options'
import { ErrorsTuto } from '@/types/types'

const getTags = (e: FormData) => {
  const tags: string[] = []
  for (const [key, value] of e.entries()) {
    if (
      !key.includes('$ACTION') &&
      value === 'on' &&
      key !== 'newbie' &&
      key !== 'apprentice' &&
      key !== 'junior'
    )
      tags.push(key)
  }
  return tags
}

const hasError = (errors: ErrorsTuto) => {
  let bool = false
  let key: keyof ErrorsTuto
  for (key in errors) {
    if (errors[key] !== '') {
      bool = true
      break
    }
  }
  return bool
}

export const createTuto = async (e: FormData) => {
  const session = await getServerSession(options)
  let errors: ErrorsTuto = { title: '', desc: '', tags: '', level: '' }
  if (!session) return
  const title = e.get('title')?.toString()
  const description = e.get('description')?.toString()
  const newbie = e.get('newbie')?.toString()
  const apprentice = e.get('apprentice')?.toString()
  const junior = e.get('junior')?.toString()
  if (!title) errors = { ...errors, title: 'Veuillez définir un titre' }
  if (!description)
    errors = { ...errors, desc: 'Veuillez définir une descritpion' }
  const levels: Level[] = []
  if (newbie) levels.push(Level.NEWBIE)
  if (apprentice) levels.push(Level.APPRENTICE)
  if (junior) levels.push(Level.JUNIOR)
  if (!levels.length)
    errors = { ...errors, level: 'Veuillez définir au moins un level' }
  const tags = getTags(e)
  if (!tags.length)
    errors = { ...errors, tags: 'Veuillez définir au moins un tag' }
  console.log('errors', errors)

  if (hasError(errors)) return errors
  if (!session.user?.email) return
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  })
  if (!user || user.role === Role.USER) return
  const tuto = await prisma.tutorial.create({
    data: {
      title: title as string,
      description: description as string,
      tags,
      levels,
      authorId: user.id,
    },
  })

  if (tuto) {
    redirect(`/create-tuto/${tuto.id}`)
  }
}
