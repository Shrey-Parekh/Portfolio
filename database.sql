CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    technologies JSON NOT NULL,
    demo VARCHAR(255),
    github VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample projects
INSERT INTO projects (title, description, image, technologies, demo, github) VALUES
(
    'E-commerce Platform',
    'A full-featured e-commerce platform with user authentication, product management, and payment integration.',
    '/images/projects/ecommerce.jpg',
    '["React", "Node.js", "MongoDB", "Stripe"]',
    'https://demo-ecommerce.com',
    'https://github.com/username/ecommerce'
),
(
    'Task Management App',
    'A collaborative task management application with real-time updates and team features.',
    '/images/projects/taskmanager.jpg',
    '["Vue.js", "Express", "PostgreSQL", "Socket.io"]',
    'https://demo-taskmanager.com',
    'https://github.com/username/taskmanager'
),
(
    'Portfolio Website',
    'A modern portfolio website with dynamic content and smooth animations.',
    '/images/projects/portfolio.jpg',
    '["HTML", "Tailwind CSS", "JavaScript", "Node.js"]',
    'https://demo-portfolio.com',
    'https://github.com/username/portfolio'
); 

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from contacts; 