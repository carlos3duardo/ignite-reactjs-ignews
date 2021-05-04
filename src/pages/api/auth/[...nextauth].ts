import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user,user:email'
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  callbacks: {
    async signIn(user, account, profile) {

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('idx_user_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {
                data: {
                  name: user.name,
                  email: q.Casefold(user.email)
                }
              }
            ),
            q.Update(
              q.Select(['ref'], q.Get(
                q.Match(
                  q.Index('idx_user_email'),
                  q.Casefold(user.email)
                )
              )),
              {
                data: {
                  name: user.name
                }
              }
            )
          )
        );

        return true;
      } catch (e) {
        return false;
      }

    }
  }
})