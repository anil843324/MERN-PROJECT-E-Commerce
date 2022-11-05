import React, { useState } from 'react';
import logo from '../../../images/logo.jpg';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { TbSearch } from 'react-icons/tb';
import { BsCart3 } from 'react-icons/bs';
import { MdPermContactCalendar } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [toggle, setToggle] = useState(true);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="w-full  h-[70px] bg-black">
      <div className="max-w-[1240px] mx-auto px-4 flex justify-between items-center h-full">
        <div>
          <h1 className="text-[#00d8ff] ">
            <img
              className="w-24 h-14 rounded-md cursor-pointer"
              src={logo}
              alt="logo"
            />
          </h1>
        </div>
        <div className=" hidden md:flex">
          <ul className="flex text-white  items-center cursor-pointer">
            <Link to={'/'}>
              <li>Home</li>
            </Link>

            <Link to={'/product'}>
              <li>Product</li>
            </Link>

            <Link to={'/contact'}>
              <li>Contact</li>
            </Link>

            <Link to={'/about'}>
              <li>About</li>
            </Link>

            <li>
              <TbSearch size={25} />
            </li>
            <li>
              <BsCart3 size={25} />
            </li>
            <li>
              <MdPermContactCalendar size={25} />
            </li>
          </ul>
        </div>
        {/* Ham burger */}
        <div className="block md:hidden ">
          {/* <AiOutlineMenu size={30} className="text-white" /> */}
          {toggle ? (
            <AiOutlineMenu
              size={30}
              className="text-white cursor-pointer"
              onClick={() => handleToggle()}
            />
          ) : (
            <AiOutlineClose
              size={30}
              className="text-white cursor-pointer"
              onClick={() => handleToggle()}
            />
          )}
        </div>
        {/* mobile menu */}
        {!toggle ? (
          <div className="  md:hidden w-full  bg-black text-white absolute top-[60px] left-0  flex justify-center text-center">
            <ul className=" flex flex-col items-center  cursor-pointer ">
              <Link to={'/'}>
                <li>Home</li>
              </Link>

              <Link to={'/product'}>
                <li>Product</li>
              </Link>

              <Link to={'/contact'}>
                <li>Contact</li>
              </Link>

              <Link to={'/about'}>
                <li>About</li>
              </Link>
              <li>
                <TbSearch size={25} />
              </li>
              <li>
                <BsCart3 size={25} />
              </li>
              <li>
                <MdPermContactCalendar size={25} />
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;
