import React from 'react';
import ReactMarkdown from 'react-markdown';

const CustomMarkdown = ({ children, hideTitle = false, className }) => {
  return (<ReactMarkdown
    className={`markdown ${className} bg-[--primary-background-color] text-[--primary-text-color] overflow-y-auto outline-none text-[1rem] `}
    children={children}
    components={{
      img: ({ node, ...props }) => {
        return (<img {...props} className="max-w-[100%]" alt={props.alt} />)
      },
      h1: ({ node, ...props }) => {
        return (<h1 {...props} className={`text-[--primary-text-color] font-bold m-5 ${hideTitle ? "hidden" : ""}`}
          children={props.children} />)
      },
      h2: ({ node, ...props }) => {
        return (<h2 {...props} className={`text-[--primary-text-color] font-bold m-4 ${hideTitle ? "hidden" : ""}`}
          children={props.children} />)
      },
      h3: ({ node, ...props }) => {
        return (<h3 {...props} className="text-[--primary-text-color] font-bold m-3" children={props.children} />)
      },
      li: ({ node, ...props }) => {
        return (<li {...props} className="select-all m-2 ml-8" />)
      },
      p: ({ node, ...props }) => {
        return (<p {...props} className="mb-4" />)
      },
    }}
  />)
}

export default CustomMarkdown;