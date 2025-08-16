'use client'
import { cn } from '~/lib/utils'
import { motion, SpringOptions, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

export type AnimatedNumberProps = {
    value: number
    className?: string
    springOptions?: SpringOptions
}

export function AnimatedNumber({ value, className, springOptions }: AnimatedNumberProps) {
    const spring = useSpring(value, springOptions)
    const display = useTransform(spring, current => Math.round(current).toLocaleString())

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    return <motion.span className={cn('tabular-nums', className)}>{display}</motion.span>
}
