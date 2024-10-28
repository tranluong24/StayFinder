import { Children } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header"
import Hero from "../components/Hero";

interface Props{
    children: React.ReactNode
}

const Layout = ({children}: Props) =>{
    return (
        /*
        flex: Bật Flexbox cho div
        flex-col: Sắp xếp các phần tử con theo cột dọc
        min-h-screen: Chiều cao tối thiểu của div bằng chiều cao màn hình
        */
        <div className = "flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className = "container mx-auto py-10 flex-1">
                {children}
            </div>
            <Footer />
        </div>   
    )
};

export default Layout