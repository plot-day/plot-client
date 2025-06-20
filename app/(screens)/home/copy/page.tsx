'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Page = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>2번 페이지</h2>
      <Link href="/home/home">Back to 1번</Link>
    </motion.div>
  );
};

export default Page;
