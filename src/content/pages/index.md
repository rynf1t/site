---
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';

const pages = await getCollection('pages', ({ id }) => id === 'index.md');
const { Content } = await pages[0].render();
---

welcome to my site