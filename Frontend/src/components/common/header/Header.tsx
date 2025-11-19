import React from 'react';
import {StyledAppBar, StyledToolbar} from "./Header.styles.ts";
import BookPlaceLogo from "../../common/BookPlaceLogo.tsx";
import HeaderCenterSection from "./HeaderCenterSection.tsx";
import HeaderUserSection from "./HeaderUserSection.tsx";


interface HeaderProps {
  showSearch?: boolean;
  centerContent?: React.ReactNode;
}
const Header: React.FC<HeaderProps> = ({ showSearch = false, centerContent }) => {
  return (
    <StyledAppBar position="sticky" elevation={0}>
        <StyledToolbar>
            <BookPlaceLogo/>
            <HeaderCenterSection showSearch={showSearch} centerContent={centerContent} />
            <HeaderUserSection />
        </StyledToolbar>
    </StyledAppBar>
  );
};
export default Header;
