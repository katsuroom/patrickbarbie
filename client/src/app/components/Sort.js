"use client"

import * as React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import SortIcon from '@mui/icons-material/Sort';

export default function Sort() {

  const handleLike = () => {
    console.log('Liked!');
  };

  const handleViews = () =>{
    console.log('Views');
  }

  const handleAtoZ = () => {
    console.log('AtoZ!');
  };

  const handleLastModified = () => {
    console.log('LastModified!');
  };

  const handlePublished = () => {
    console.log('Published!');
  };
  const handleRelevant = () => {
    console.log('Relevant!');
  };
    return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
      >
        <SortIcon />
      </MenuButton>
      <Menu>
        <MenuItem onClick = {handleLike}>Likes</MenuItem>
        <MenuItem onClick = {handleViews}>Views</MenuItem>
        <MenuItem onClick = {handleAtoZ}>A to Z</MenuItem>
        <MenuItem onClick = {handleLastModified}>Last Modified</MenuItem>
        <MenuItem onClick = {handlePublished}>Published Date</MenuItem>
        <MenuItem onClick = {handleRelevant}>Most Relevant</MenuItem>
      </Menu>
    </Dropdown>
  );
}