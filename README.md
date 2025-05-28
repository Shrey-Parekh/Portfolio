# Professional Developer Portfolio

A modern, responsive portfolio website built with HTML, Tailwind CSS, JavaScript, Node.js, and MySQL.

## Features

- Responsive design with modern UI/UX
- Dark/Light theme toggle
- Smooth animations and transitions
- Dynamic project showcase
- Contact form with email functionality
- MySQL database integration
- GSAP animations
- AOS (Animate On Scroll) effects

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
- Create a MySQL database
- Import the schema from `database.sql`

4. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   ├── js/
│   │   └── main.js
│   └── images/
├── server.js
├── database.sql
├── package.json
├── tailwind.config.js
└── .env
```

## Customization

1. Update personal information in `index.html`
2. Add your projects to the MySQL database
3. Customize colors in `tailwind.config.js`
4. Add your own images to the `public/images` directory

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Node.js
- Express.js
- MySQL
- GSAP
- AOS
- Nodemailer

## License

MIT License 