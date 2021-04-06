/**
 * @file Keystone config.
 *
 * Configuration for Keystone CMS.
 */

import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  // How long should they stay signed in?
  maxAge: 60 * 60 * 24 * 360, // sec * min * hours * days
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  // Which schema is responsible for this?
  listKey: 'User',
  // Which field in user identifies the user?
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: add in initial roles.
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose', // TODO: Now deprecated in Keystone, may need to change.
      url: databaseURL,
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      User,
      Product,
      ProductImage,
    }),
    ui: {
      isAccessAllowed: ({ session }) => !!session?.data, // The !! ensures we return boolean.
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id',
    }),
    // TODO: Add session values here.
  })
);
