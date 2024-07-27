"use client";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "./context/AuthContext";
import pcat from "../public/pcat_logo.png";
import { RxCross1 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineFileSearch } from "react-icons/ai";
import dynamic from "next/dynamic";
import { GetUserPhotoUrl, GetUserName } from "./utils/GetData";
import { convertEmailToDomain } from "./utils/UpdateData";
import { GetAllProjectData } from "./utils/GetData";
import { useState, useEffect } from "react";
import BottomBar from "./components/BottomBar";

const Projects = dynamic(() => import("./components/Projects"));
export default function Home() {
  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const customStyles = `
  .search-input {
    margin-left: 15px;
    width: fit-content;
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    placeholder: white;
  }

  .search-input::placeholder {
    color: white;
  }

  .search-input::-webkit-search-cancel-button {
    appearance: none;
    background-image: url('https://img.icons8.com/ios/50/multiply.png'); /* Replace with your custom icon URL */
    background-size: contain;
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
`;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };


  const [userName, setUserName] = useState("<Anonymous>");
  const [dpUrl, setDpUrl] = useState(
    "https://i.ibb.co/n3j7DWd/Windows-10-Default-Profile-Picture-svg.png"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    GetAllProjectData().then((data) => {
      setProjects([...data]);
    });
  }, []);

  const [searchInput, setSearchInput] = useState(""); // State for search input

  useEffect(() => {
    GetAllProjectData().then((data) => {
      setProjects([...data]);
    });
  }, []);

  // Filter projects based on the search input
  const filteredProjects = projects.filter((project) => {
    // If the search input is empty, don't filter
    if (searchInput.trim() === "") {
      return true;
    }

    const searchTerm = searchInput.toLowerCase();

    // Check if the title, hashtags, category, or tech language contains the search term
    return (
      project.title.toLowerCase().includes(searchTerm) ||
      project.Hastags.toLowerCase().includes(searchTerm) ||
      project.Category.toLowerCase().includes(searchTerm) ||
      project.TechLang.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    if (user) {
      GetUserName(convertEmailToDomain(user.email)).then((name) => {
        setUserName(name);
      });
      GetUserPhotoUrl(convertEmailToDomain(user.email)).then((url) => {
        setDpUrl(url);
      });
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };



  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    (windowWidth >= 768 ? (
      <main>
        <div className=" p-10 w-full h-screen bg-gradient-to-b from-[#0c163a] to-[#ea65dd] text-stone-300 ">
          {user ? (
            <div>
              <div className="h-full">
                <div className="flex justify-between">
                  <div className="flex gap-4 pb-[6%]">
                    <button onClick={toggleDropdown}>
                      {isDropdownOpen ? (
                        <RxCross1 size={30} />
                      ) : (
                        <GiHamburgerMenu size={30} />
                      )}
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute w-[200px] rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[60px] ms-[35px] ">
                        <div
                          className="py-2 px-4"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <Link
                            href="/profile/myprofile"
                            className="block px-4 py-2 text-black"
                            role="menuitem"
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/upload"
                            className="block px-4 py-2 text-black"
                            role="menuitem"
                          >
                            Add New Project
                          </Link>
                          <Link
                            href="/message"
                            className="block px-4 py-2 text-black"
                            role="menuitem"
                          >
                            Messages
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="block px-4 py-2 text-black"
                            role="menuitem"
                          >
                            Sign Out
                          </button>
                          <Link
                            href=""
                            className="block px-4 py-2 text-black"
                            role="menuitem"
                          >
                            About Us
                          </Link>
                        </div>
                      </div>
                    )}
                    <Link
                      href="/profile/myprofile"
                      className="flex gap-4 place-items-center"
                    >
                      <Image
                        src={dpUrl}
                        alt="Photo"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <p>{userName}</p>
                    </Link>
                  </div>
                  <div className="w-[2.5] flex gap-4 items-center">
                    <div>
                      <p className="text-4xl font-bold text-white pb-4 font-['Krona One'] tracking-[.2rem]">
                        PROJECT CATALYSER
                      </p>
                      <p className="text-xs ps-2">
                        Welcome to
                        <br />
                        Project Catalyser,where we
                        <br />
                        Connect, Create, Conquer.
                      </p>
                    </div>
                    <Image
                      alt="Logo"
                      src={pcat}
                      width={120}
                      onClick={() => window.location.reload()}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
                <div className="p-10 flex justify-between ">
                  <p className="text-2xl">Look In to Library</p>
                  <div className="bg-[#9f74ac] w-[50%] rounded-xl h-fit p-2 flex items-center">
                    <AiOutlineFileSearch size={20} />
                    <input
                      type="text"
                      className="mx-auto bg-transparent border-none outline-none text-white placeholder-white"
                      placeholder="Search Projects"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between">
                <div className="flex ms-7 gap-4 pb-[6%]">
                  <div className="flex gap-4 place-items-center">
                    <Link
                      href="/signup"
                      className="w-fit px-5 p-2 bg-fuchsia-500 rounded-xl text-xl font-bold"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/signin"
                      className="text-2xl font-bold text-fuchsia-500 "
                    >
                      Log in
                    </Link>
                  </div>
                </div>
                <div className="w-[2.5] flex gap-4 items-center">
                  <div>
                    <p className="text-4xl font-bold text-white pb-4 font-['Krona One'] tracking-[.2rem]">
                      PROJECT
                      <br />
                      CATALYZERS
                    </p>
                    <p className="text-xs ps-2">
                      Welcome to
                      <br />
                      Project Catalyser,where we
                      <br />
                      Connect, Create, Conquer.
                    </p>
                  </div>
                  <Image
                    alt="Logo"
                    src={pcat}
                    width={120}
                    onClick={() => window.location.reload()}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div className="p-10 flex justify-between ">
                <p className="text-2xl">Look In to Library</p>
                <div className="bg-[#9f74ac] w-[35%] rounded-xl h-fit p-2 flex items-center">
                  <AiOutlineFileSearch size={20} />
                  <input
                    type="search"
                    className="mx-auto bg-transparent border-none outline-none text-white placeholder-white"
                    placeholder="Search Projects"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <style jsx>
            {`
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: gray transparent;
              }

              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: gray;
                border-radius: 5px;
              }

              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
            `}
          </style>
          <div className="w-full h-[50%] overflow-y-auto py-5 custom-scrollbar">
            {projects.length !== 0 ?
              <div className="flex flex-row justify-left">
                {filteredProjects.length !== 0 ? (
                  <Projects projects={filteredProjects} />
                ) : (
                  <div className="w-screen mt-5 flex flex-col justify-center items-center">
                    <img
                      width="40"
                      height="40"
                      src="https://img.icons8.com/ios/40/nothing-found.png"
                      alt="nothing-found"
                      style={{ filter: 'invert(1)', fill: 'white' }}
                    />
                    <span>No search result</span>
                  </div>
                )}
              </div>
              :
              <div className="flex justify-center gap-5">
                <style>
                  {`
          .skeleton-box {
            height: 150px;
            width: 320px;
            margin-bottom: 16px;
            background: linear-gradient(to right, #626363 25%, #ddd 50%, #626363 75%);
            background-size: 800% 100%;
            animation: wave 2s infinite linear;
            border-radius: 5px; 
          }

          @keyframes wave {
            0% {
              background-position: 100% 0%;
            }
            100% {
              background-position: -100% 0%;
            }
          }
        `}
                </style>

                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
              </div>
            }
          </div>
        </div>
      </main>
    ) : (
      <main>
        <div className=" p-10 w-screen h-screen bg-gradient-to-b from-[#0c163a] to-[#ea65dd] text-stone-300 ">
          <div>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <div className="h-full">
              <div className="flex justify-between">
                <div className="w-[2.5] flex gap-4 items-center">
                  <div>
                    <p className="text-xl font-bold text-white pb-4 font-['Krona One'] tracking-[.2rem]">
                      PROJECT CATALYSER
                    </p>
                    <p className="text-[10px]">
                      Welcome to
                      <br />
                      Project Ctalyser,where we
                      <br />
                      Connect, create, conquer.
                    </p>
                  </div>
                  <Image
                    alt="Logo"
                    src={pcat}
                    width={100}
                    onClick={() => window.location.reload()}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#9f74ac] my-5 w-full rounded-xl h-fit p-2 flex flex-row items-center">
                <span><AiOutlineFileSearch size={20} /></span>
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search Projects"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e)}
                />
              </div>
              <p className=" mb-2 text-xl">Look In to Library</p>
            </div>
          </div>
          <div className="w-full h-[60%] overflow-y-auto py-5">
            {projects.length !== 0 ?
              <div className="flex flex-row justify-left">
                {filteredProjects.length !== 0 ? (
                  <Projects projects={filteredProjects} />
                ) : (
                  <div className="w-screen mt-5 flex flex-col justify-center items-center">
                    <img
                      width="40"
                      height="40"
                      src="https://img.icons8.com/ios/40/nothing-found.png"
                      alt="nothing-found"
                      style={{ filter: 'invert(1)', fill: 'white' }}
                    />
                    <span>No search result</span>
                  </div>
                )}
              </div>
              :
              <div className="flex flex-col text-white gap-5 text-xl">
                <style>
                  {`
          .skeleton-box {
            height: 140px;
            width: 300px;
            margin-bottom: 16px;
            background: linear-gradient(to right, #626363 25%, #ddd 50%, #626363 75%);
            background-size: 800% 100%;
            animation: wave 2s infinite linear;
            border-radius: 5px; 
          }

          @keyframes wave {
            0% {
              background-position: 100% 0%;
            }
            100% {
              background-position: -100% 0%;
            }
          }
        `}
                </style>

                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
              </div>
            }
          </div>
        </div>
        <BottomBar dpUrl={dpUrl} />
      </main>
    ))
  );
}
