'use client'

import React from 'react'
import { useState, useEffect } from 'react'
function MenuBarItem({ 
  title, 
  menuItems,
  justify,
  showAll,
  setShowAll,
  styles={}
}) {

  let updateShow = (showMe) => setShowAll(s => { 
    let obj = Object.assign({}, s); 
    obj[title] = showMe; 
    return obj 
  })

  const show = showAll[title]

  const dropdownStyles = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  }

  const backgroundStyles = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: '0%',
    top: 0,
    left: 0,
    zIndex: 5,
    backgroundColor: 'black',
    pointerEvents: 'none',
  }

  const menuBarItemStyles = {
    marginLeft: justify == 'right' ? 'auto' : '0px',
    zIndex: 10,
    paddingLeft: '5px',
    paddingRight: '5px',
  }

  const onMouseOver = (e) => {
    e.preventDefault();

    if (Object.values(showAll).some(i => i)) {
      updateShow(true)
    }

  }

  const onMouseOut = (e) => {
    console.log('onMouseOut')
    e.preventDefault();
    // setTimeout(() => updateShow(false), 1000)
    updateShow(false)
  }

  const openMenuBar = (e) => {
    event.preventDefault(); 
    console.log('{'+title+'} item clicked')
    show ? updateShow(false) : updateShow(true)
  }

  const onClickDropdownItem = (e) => {
    event.preventDefault(); 
    console.log(`${e.target.key} clicked`)
    // console.log(`${menuItem.title} clicked`)
      updateShow(false)
  }

  return (
    <div className={styles['menu-bar-item']} style={menuBarItemStyles} onMouseOver={onMouseOver} onMouseOut={onMouseOut} >
      <div
        onClick={openMenuBar}>
          {title}
      </div>
      <div className={styles['menu-bar-dropdown']}  style={dropdownStyles} onMouseOver={onMouseOver} onMouseOut={onMouseOut} >
        { show ? menuItems?.map(menuItem => {
          let func = () => {}
          if (menuItem.onClick)
            func = menuItem.onClick

          let disabled = false
          if (menuItem.disabled == true)
            disabled = true

          return (
            <div
              key={menuItem.title}
              className={styles['menu-bar-dropdown-item']}
              style={disabled ? {'opacity': '0.6'} : null}
              onClick={(e) => { onClickDropdownItem(e); func(); }}
            >
              {menuItem.title}
          </div>)
        }) : null
      }
      </div>
      {show ? <div 
        className={styles['background']} 
        onClick={(e) => {console.log('background clicked'); updateShow(false)}}
         style={backgroundStyles}
        >
          {}
        </div> : null
      }
    </div>
  )
}

export default function MenuBar({ 
  items={}, 
  styles={}
}) {
 
  // console.log('items:', Object.keys(items).reduce((acc, curr) => {
  //   acc[curr] = false
  //   return acc
  // }, {}))
  // let obj = {}
  // Object.keys(items).map(i => obj[i] = false)
  // console.log(obj)
  

  // useEffect(() => {
  //   let showWhich = Object.keys(items).reduce((acc, curr) => {
  //     acc[curr] = false
  //     return acc
  //   }, {})
  //   console.log('show which:', showWhich)
  //   setShow(showWhich)

  // }, [items])
  // const [show, setShow] = useState('test')
  let [showAll, setShowAll] = useState(
    Object.keys(items).reduce((acc, curr) => {
      acc[curr] = false
      return acc
    }, {})
  )

  const basicStyles = {
    display: 'flex', 
    flex: '0 0 0',
    flexDirection: 'row',
  }
  return (
    <div className={styles['menu-bar']} style={basicStyles}>
      {Object.keys(items).map(key => {
        let menu = items[key]
        if (menu instanceof Array) {
          return (
              <MenuBarItem
                key={key}
                title={key}
                menuItems={menu}
                styles={styles}
                showAll={showAll}
                // showMe={show[key]}
                setShowAll={setShowAll}
              /> 
          )
        }
        else {
          return (
            <MenuBarItem
              key={key}
              title={key}
              onClick={menu['onClick']}
              justify={menu['justify']}
              styles={styles}
              showAll={showAll}
              // showMe={show[key]}
              setShowAll={setShowAll}
            />
          )
        }
      })}
    </div>
  )
}