import { FC } from 'preact/compat';

interface LogoProps {
    size?: number;
}

const Logo: FC<LogoProps> = ({ size = 65 }) => {
    return (
        <div className="flex items-center justify-center p-1">
            <img
                src="/logo.png"
                alt="APISpider Logo"
                width={size}
                height={size}
                className="transition-transform duration-200 group-hover:scale-110 object-contain"
            />
        </div>
    );
}

export default Logo;