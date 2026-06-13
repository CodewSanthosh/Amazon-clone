import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/styles'

const Navbar = ({ active }) => {
    return (
        <div className={`block 800px:${styles.noramlFlex}`}>
            {
                navItems.map((i, index) => (
                    <div className='flex' key={index}>
                        <Link to={i.url}
                            className={`${active === index + 1 ? "text-[#ff9900]" : "text-[#131921] 800px:text-[#ffffffcc]"} pb-[30px] 800px:pb-0 font-[500] px-5 cursor-pointer text-[14px] hover:text-[#ff9900] transition`}
                        >
                            {i.title}
                        </Link>
                    </div>
                ))
            }
        </div>
    )
}

export default Navbar
