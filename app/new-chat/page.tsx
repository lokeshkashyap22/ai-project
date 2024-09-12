"use client";
import { useState, useEffect, useRef } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { MdAttachFile, MdSend, MdContentCopy } from "react-icons/md";
import { marked } from "marked";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const dummyChats = [
  { sender: "user", message: "Hi there!", timestamp: "10:00 AM" },
  { sender: "bot", message: "## Hello! How can I help you?", timestamp: "10:01 AM" },
];

const searchHistory = [
  "How to use ChatQ?",
  "Features of ChatQ",
  "ChatQ pricing",
];

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const chatContainerRef = useRef<any>(null);

  useEffect(() => {
    // Load chat history from sessionStorage when the component mounts
    const storedMessages = sessionStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages(dummyChats);
    }
  }, []);

  useEffect(() => {
    // Save chat history to sessionStorage whenever messages state changes
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSendMessage = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post("/api/gptai", {
        askedQuestion: newMessage,
      });

      if (response.data?.response) {
        const formattedResponse = marked(response.data.response);

        const botMsg = {
          sender: "bot",
          message: formattedResponse,
          timestamp: new Date().toLocaleTimeString(),
        };

        const userMsg = {
          sender: "user",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages([...messages, userMsg, botMsg]);
        setNewMessage("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: any) => {
    console.log("File uploaded:", e.target.files[0]);
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <h1 className="absolute md:hidden left-4 top-4 font-bold text-4xl text-gray-900 text-center w-full md:w-auto md:text-left">
        ChatQ
      </h1>
      <button className="md:hidden p-4 text-black" onClick={toggleDrawer}>
        <CiMenuFries size={24} />
      </button>
      <div
        className={`fixed inset-y-0 left-0 bg-gray-200 p-4 transition-transform transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-64 lg:w-80`}
      >
        <button className="md:hidden p-4 text-black" onClick={toggleDrawer}>
          <IoMdClose size={24} />
        </button>
        <div className="mt-4 flex flex-col h-full">
          <h1 className="hidden md:block font-bold text-4xl text-gray-900 text-center">
            ChatQ
          </h1>
          <div className="flex-1 mt-4">
            <h2 className="text-xl font-bold">Search History</h2>
            <ul>
              {searchHistory.map((item, index) => (
                <li key={index} className="py-2 border-b border-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="ml-0 md:ml-64 lg:ml-80 p-4">
        <div className="flex justify-between items-center">
          <h1 className="hidden md:block font-bold text-4xl text-gray-900">
            ChatQ
          </h1>
          <div className="relative">
            <button className="p-2 text-gray-900" onClick={toggleDropdown}>
              <FaUserCircle size={32} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dashboard</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">More about ChatQ</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="bg-white p-4 h-screen rounded-lg shadow-lg">
            <div ref={chatContainerRef} className="overflow-y-scroll overflow-x-hidden h-[77vh] p-2 border border-gray-300 rounded-lg">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2 `}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white pr-2" : "bg-gray-300 text-black"
                      }`}
                  >
                    <div className="flex items-start">
                      <p dangerouslySetInnerHTML={{ __html: msg.message }} />
                      {msg.sender === "bot" && (
                        <button
                          className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => copyToClipboard(msg.message)}
                        >
                          <MdContentCopy size={16} />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-gray-200 rounded-l-lg">
                <MdAttachFile size={24} />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <input
                type="text"
                className="flex-1 border outline-none border-gray-300 p-2 rounded-none"
                placeholder="Ask a question..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleEnterPress}
                disabled={isLoading}
              />
              <button
                className="p-2 bg-blue-500 text-white rounded-r-lg"
                onClick={handleSendMessage}
                disabled={isLoading} 
              >
                {isLoading ? (
                  <ClipLoader color={"#ffffff"} size={24} />
                ) : (
                  <MdSend size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
