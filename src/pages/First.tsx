import {motion} from 'framer-motion'
const menuItems = [
  { name: "Home", from: "right" },
  { name: "About", from: "bottom" },
  { name: "Contact", from: "left" },
];
export const First = () =>{
    return(
        <div className="bg-gray-100 text-gray-800 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to My Page</h1>

        <nav className="space-x-8 text-lg font-medium">
          {menuItems.map(({ name, from }, index) => {
            const direction = {
              left: { x: -500, opacity: 0 },
              right: { x: 500, opacity: 0 },
              bottom: { y: 50, opacity: 0 },
            }[from];

            return (
              <motion.span
                key={name}
                initial={direction}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.5 }}
                className="relative inline-block cursor-pointer
                           after:content-[''] after:absolute after:bottom-0 after:left-0
                           after:w-0 after:h-[2px] after:bg-blue-500
                           after:transition-all after:duration-300
                           hover:after:w-full"
              >
                {name}
              </motion.span>
            );
          })}
        </nav>

        <p className="text-gray-600">
          Hover over the menu items to see the underline animation.
        </p>
      </div>
    </div>
    );
}