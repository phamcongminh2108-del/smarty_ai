
import React from 'react';
import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: 'intro-ai',
    title: 'Foundations of AI',
    description: 'Learn the fundamental concepts that power modern artificial intelligence.',
    icon: '🧠',
    color: 'bg-blue-100 text-blue-600',
    lessons: [
      {
        id: 'what-is-ai',
        title: 'What is Intelligence?',
        duration: '5 min',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
        content: `Artificial Intelligence isn't just about robots; it's about computation that mimics human cognitive functions. In this lesson, we explore the difference between symbolic logic and modern machine learning. Imagine a computer that doesn't just follow rules, but learns from patterns in the world around it.`,
        quiz: [
          {
            question: "What is the primary difference between traditional programming and AI?",
            options: ["AI uses robots, programming doesn't", "AI learns from patterns, programming follows strict rules", "AI is faster than programming", "There is no difference"],
            answerIndex: 1
          }
        ]
      },
      {
        id: 'history-ai',
        title: 'A Brief History',
        duration: '8 min',
        imageUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=1000',
        content: `From Alan Turing's imitation game to the first neural network, the "Perceptron". AI has gone through many seasons, known as "AI winters" and "AI summers". Today, we live in an era of unprecedented scale and data, leading to the breakthrough of Large Language Models.`,
        quiz: [
          {
            question: "What are periods of reduced funding and interest in AI research called?",
            options: ["AI Autumns", "AI Winters", "AI Dormancy", "Logic Freezes"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    id: 'gen-ai',
    title: 'Generative Models',
    description: 'Explore how machines create art, text, and music from scratch.',
    icon: '✨',
    color: 'bg-purple-100 text-purple-600',
    lessons: [
      {
        id: 'how-it-works',
        title: 'Probability and Creativity',
        duration: '10 min',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
        content: `Generative AI works by predicting the next most likely element in a sequence. Whether it's a pixel in an image or a word in a sentence, the model uses its deep understanding of probability to create something entirely new. It's like a high-tech game of "complete the pattern".`,
        quiz: [
          {
            question: "How does Generative AI create new content?",
            options: ["By copying existing files", "By predicting the next likely element in a sequence", "By searching the internet in real-time", "By following a human's exact drawings"],
            answerIndex: 1
          }
        ]
      },
      {
        id: 'transformers',
        title: 'The Transformer Revolution',
        duration: '12 min',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6750?auto=format&fit=crop&q=80&w=1000',
        content: `Introduced in 2017, the Transformer architecture changed everything. By using a mechanism called "Attention", models can weigh the importance of different parts of the input data regardless of their distance. This is why AI can now understand complex context in long essays.`,
        quiz: [
          {
            question: "Which mechanism allows Transformers to understand long-range context?",
            options: ["Retention", "Attention", "Intention", "Prevention"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics & Society',
    description: 'Understand the impact of AI on humanity and our responsibility as builders.',
    icon: '⚖️',
    color: 'bg-emerald-100 text-emerald-600',
    lessons: [
      {
        id: 'bias',
        title: 'Algorithmic Bias',
        duration: '7 min',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
        content: `AI models learn from human data, and humans are imperfect. If our datasets contain biases, the AI will amplify them. We must be vigilant in how we train models to ensure fairness, especially in sensitive areas like hiring, lending, and law enforcement.`,
        quiz: [
          {
            question: "Why do AI models sometimes show bias?",
            options: ["They are programmed to be mean", "They reflect and amplify biases present in their training data", "They have their own opinions", "They don't have enough electricity"],
            answerIndex: 1
          }
        ]
      }
    ]
  }
];
