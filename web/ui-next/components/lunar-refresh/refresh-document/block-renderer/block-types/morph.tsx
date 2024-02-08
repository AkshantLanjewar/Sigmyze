import { ElementType, HTMLAttributes } from "react";

interface ComponentProps extends HTMLAttributes<HTMLOrSVGElement> {
    as?: ElementType;
}

const PolymorphicComponent: React.FC<ComponentProps> = ({ as: Tag = 'div', ...otherProps }) => {
    return <Tag {...otherProps} />;
};

export default PolymorphicComponent