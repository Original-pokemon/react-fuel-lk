import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { AppRouteType } from '#root/types';
import MainMenuStyle from './MainMenu.style';

type MenuItemType = {
  id: number;
  title: string;
  url: AppRouteType;
  icon: React.JSX.Element;
};

export type MenuType = {
  id: number;
  title: string;
  listItems: MenuItemType[];
}[];

type MenuProperties = {
  menu: MenuType;
};

const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  const target = event.currentTarget;

  target.classList.toggle('active');
};

function MainMenu({ menu }: MenuProperties) {
  return (
    <List css={MainMenuStyle}>
      {menu.map((item) => (
        <ListItem
          className="item"
          key={item.id}
          alignItems="flex-start"
          disablePadding
        >
          <ListItemText className="title">{item.title}</ListItemText>

          <List className="list">
            {item.listItems.map((listItem) => (
              <ListItem
                component={NavLink}
                to={listItem.url}
                key={listItem.id}
                className="listItem"
                // className={({ isActive }) => isActive ? "listItem active" : "listItem"}
                onClick={handleClick}
              >
                {listItem.icon}
                <ListItemText className="listItemTitle">
                  {listItem.title}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </ListItem>
      ))}
    </List>
  );
}

export default MainMenu;
