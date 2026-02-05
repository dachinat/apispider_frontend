import Logo from "./Logo";
import { FunctionalComponent, Fragment } from 'preact';

const Branding: FunctionalComponent = () => {
    return (
        <Fragment>
            <Logo />
            <span className="text-lg font-semibold text-base-content tracking-wide">
                apispider
            </span>
        </Fragment>
    );
}

export default Branding;