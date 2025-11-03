'use client'

import { Button } from '~/components/ui/button'
import { motion } from 'motion/react'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { HiArrowUp } from 'react-icons/hi'

export function ScrollToTop(): React.ReactElement {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    useEffect(() => {
        const handleScroll = debounce(() => {
            setIsVisible(window.scrollY > 500)
        }, 100)

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleButtonClick = (): void => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const handleMouseEnter = (): void => {
        setIsHovered(true)
    }

    const handleMouseLeave = (): void => {
        setIsHovered(false)
    }

    const buttonOpacity: number = isVisible ? 1 : 0
    const buttonY: number = isHovered ? -5 : 0

    return (
        <motion.div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed bottom-0 right-0 z-50 p-2"
            initial={{ opacity: 0 }}
            animate={{
                opacity: buttonOpacity,
                y: buttonY,
            }}
            transition={{ duration: 0.15 }}
        >
            <Button variant="secondary" className="hover:bg-secondary" onClick={handleButtonClick}>
                <HiArrowUp />
            </Button>
        </motion.div>
    )
}
