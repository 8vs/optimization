import React from "react";

type HeaderProps = {
    title: string;
    description: string;
}

export const Header = ({title, description}: HeaderProps) => {
    return (
        <>
            <div className="px-3 py-20 text-center ">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    {title.toUpperCase()}
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </>
    )
}