# Resmate

A modern thesis document critique platform designed for students and educators. Built with Next.js for framework, Tailwind CSS for styling, and Supabase for backend services like authentication and database management. This application aims to streamline the process of providing and receiving feedback on academic thesis, fostering a collaborative learning environment.

# ✨ Features

- **Draft Submission**: Students can submit their thesis drafts for review
- **Document Annotation**: Advisers can highlight and comment on specific sections of the document
- **Feedback Management**: Organize and track feedback from reviewers
- **User Roles**: Different access levels for students and advisers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Authentication**: Secure login with Google OAuth and email/password
- **Real-time Updates**: Live updates using Supabase real-time subscriptions

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Git installed on your machine

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-resmate-web.git
   cd batch-2025-resmate-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## 🏃‍♂️ Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.


## 📖 Usage

### For Instructors:

1. **Create an Account**: Sign up using Google OAuth or email/password
2. **Review Submissions**: Access student thesis drafts for review
3. **Provide Feedback**: Annotate documents and leave comments

### For Students:

1. **Create an Account**: Sign up using Google OAuth or email/password
2. **Submit Draft**: Upload your thesis draft for review
3. **View Feedback**: Access feedback provided by your advisers


## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_BASE_URL` | Base URL for QR code generation | Yes |


## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-resmate-web.git)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling


## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/KaelNierras/class-qa-board/issues) on GitHub.

---

Made with ❤️ for educators and students everywhere.