'use client'

import { motion } from 'framer-motion'
import type { Service } from '@/lib/types'

interface ServiceCardProps {
  service: Service
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.02 }}
      className="group relative p-6 md:p-8 border border-glass rounded-sm bg-bg-secondary hover:border-white/16 hover:bg-bg-secondary/80 transition-all duration-300 cursor-default"
    >
      <div className="mb-4 text-xs uppercase tracking-widest text-accent-orange">
        {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight text-text-primary mb-3 group-hover:text-white transition-colors duration-200">
        {service.title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {service.description}
      </p>
      <div className="absolute bottom-0 left-0 w-0 h-px bg-accent-orange group-hover:w-full transition-all duration-500" />
    </motion.div>
  )
}
