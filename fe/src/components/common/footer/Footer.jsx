import React from "react";
import "./Footer.css";
const Footer = () => {

    const ContactCol = () => {
        return (
            <div className="contact-container flex flex-col max-w-[25%] text-left text-wrap text-md">
                <div className="contact-title font-semibold text-lg">
                    Thông tin liên hệ
                </div>
                <div className="address flex items-center">
                    <span><i className="lni lni-map"></i></span>
                    Số 1 Võ Văn Ngân, Phường Linh Chiểu, Quận Thủ Đức, TP.HCM
                </div>
                <div className="phone flex items-center">
                    <span><i className="lni lni-phone"></i></span>
                    0123456789
                </div>
                <div className="email flex items-center">
                    <span><i className="lni lni-envelope"></i></span>
                    <a href="mailto:vkq265@gmail.com">vkq265@gmail.com</a>
                </div>
                <div className="work-time flex items-center">
                    <span><i className="lni fas fa-clock"></i></span>
                    T2-CN (8:00 - 17:00)
                </div>
            </div>
        );
    }

    const HelpOptionCol = () => {
        return (
            <div className="help-option-container flex flex-col max-w-[25%] text-left text-wrap text-md pr-20">
                <div className="help-option-title font-semibold text-lg">
                    Hỗ trợ
                </div>
                <div className="help-option-item">
                    <a href="/about-us">Giới thiệu</a>
                </div>
                <div className="help-option-item">
                    <a href="return-policy">Chính sách đổi trả</a>
                </div>
                <div className="help-option-item">
                    <a href="security-policy">Chính sách bảo mật</a>
                </div>
                <div className="help-option-item">
                    <a href="term-and-service">Điều khoản dịch vụ</a>
                </div>
            </div>
        );
    }
    const LogoCol = () => {
        return (
            <div className="logo-container flex flex-col max-w-[25%] text-left text-wrap text-md">
                <div className="logo-title font-semibold text-lg">
                    Logo
                </div>
                <div className="logo-content m-2">
                    <img src="https://via.placeholder.com/125" alt="logo" />
                </div>
                <div className="social-link flex m-2">
                    <a href="https://www.facebook.com/quoc.vhp"><i className="lni lni-facebook-original"></i></a>
                    <a href="https://www.instagram.com/quoc.vhp"><i className="lni lni-instagram-original text-red-600"></i></a>
                </div>
            </div>
        );
    }

    return (
        <footer className="flex w-full pt-4">
            <div className="flex footer-container w-full justify-center">
                <div className="footer-content w-full">
                    <div className="flex flex-row flex-wrap w-full justify-between content-start m-2">
                        <ContactCol />
                        <HelpOptionCol />
                        <LogoCol />
                    </div>
                    <p>© 2024 All rights reserved</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;