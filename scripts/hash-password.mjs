// Produces a bcrypt hash for a backend_members password.
//
//   node scripts/hash-password.mjs
//
// The password is typed at a hidden prompt, so it never lands in your shell
// history, in a file, or in Supabase's saved queries. Only the resulting hash
// leaves this script — paste that into the SQL editor.
//
// Cost 10 matches api/admin/auth.ts and api/admin/members.ts. The cost is
// stored inside the hash, so changing it here still verifies fine, but keep
// them aligned so new and reset passwords behave identically.
import bcrypt from 'bcryptjs'

const COST = 10
const MIN_LENGTH = 12

// Compared by code point rather than escaped literals: control characters in
// source are easy to mangle in transit, a numeric comparison is not.
const CTRL_C = 3
const CTRL_D = 4
const BACKSPACE = 127
const BACKSPACE_ALT = 8

const promptHidden = (question) =>
  new Promise((resolve, reject) => {
    process.stdout.write(question)
    const stdin = process.stdin

    if (!stdin.isTTY) {
      reject(new Error('Run this in an interactive terminal so the password can stay hidden.'))
      return
    }

    stdin.resume()
    stdin.setRawMode(true)

    let value = ''
    const finish = (result) => {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
      process.stdout.write('\n')
      resolve(result)
    }

    const onData = (chunk) => {
      for (const ch of chunk.toString('utf8')) {
        const code = ch.codePointAt(0)

        if (ch === '\n' || ch === '\r' || code === CTRL_D) return finish(value)

        if (code === CTRL_C) {
          stdin.setRawMode(false)
          process.stdout.write('\n')
          process.exit(130)
        }

        if (code === BACKSPACE || code === BACKSPACE_ALT) {
          value = value.slice(0, -1)
          continue
        }

        // Ignore stray control characters rather than embedding them.
        if (code >= 32) value += ch
      }
    }

    stdin.on('data', onData)
  })

const password = await promptHidden('New password: ')
const confirm = await promptHidden('Confirm password: ')

if (password !== confirm) {
  console.error('Those do not match. Nothing was generated.')
  process.exit(1)
}

if (password.length < MIN_LENGTH) {
  console.error(`Use at least ${MIN_LENGTH} characters. Nothing was generated.`)
  process.exit(1)
}

const hash = await bcrypt.hash(password, COST)

console.log('\nHash (safe to copy):\n')
console.log(hash)
console.log(`
Then in the Supabase SQL Editor — replace the username and name:

  insert into backend_members (username, name, role, password)
  values ('your-username', 'Your Name', 'superuser', '${hash}')
  on conflict (username) do update set password = excluded.password;
`)
