# Development:
- npm install
- cp .env.example .env
- npx prisma generate
- npx prisma migrate dev
- npm run dev

# Production:
- npm install
- cp .env.example .env
- npx prisma generate
- npx prisma migrate deploy
- npx prisma db seed
- npm run build
- npm run start
