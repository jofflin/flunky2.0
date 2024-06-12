'use client'

import {
  checkAndUpdateSubscription,
  isWorkerInstalled,
  setupPushManager,
} from '@/app/notificationService'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  BiBell,
  BiBellPlus,
  BiCog,
  BiLockAlt,
  BiLogOutCircle,
  BiPlusCircle,
  BiUserCircle,
} from 'react-icons/bi'

export interface HeaderActionsProps {
  userId: string
  isAdmin: boolean
}

export function HeaderActions({ userId, isAdmin }: HeaderActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showPushSetup, setShowPushSetup] = useState(false)
  const [showPushUpdate, setShowPushUpdate] = useState(false)
  const router = useRouter()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogOut = () => {
    setAnchorEl(null)
  }

  const handleAccountSettings = () => {
    setAnchorEl(null)
    router.push(`/configure/profile`)
  }

  const handleNotificationSetup = async () => {
    setAnchorEl(null)
    setupPushManager(userId)
      .then(() => {
        setShowPushSetup(false)
        setShowPushUpdate(true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleNotificationUpdate = async () => {
    setAnchorEl(null)
    checkAndUpdateSubscription(userId)
      .then(() => {
        console.log('updated')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    isWorkerInstalled().then((isInstalled) => {
      setShowPushSetup(!isInstalled)
      setShowPushUpdate(isInstalled)
    })
  }, [])

  return (
    <div className="flex gap-3">
      <Link className="flex items-center text-white" href="/configure/fine">
        <BiPlusCircle className="w-8 h-8" />
      </Link>
      {isAdmin && (
        <Link className="flex items-center text-white" href="/configure">
          <BiLockAlt className="w-8 h-8" />
        </Link>
      )}
      <IconButton
        id="demo-positioned-button"
        sx={{ color: 'white', padding: '0' }}
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <BiUserCircle className="w-8 h-8 text-white" />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleLogOut} className="text-yellow-500">
          <ListItemIcon>
            <BiLogOutCircle className="w-6 h-6 text-yellow-500" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAccountSettings} className="text-yellow-500">
          <ListItemIcon>
            <BiCog className="w-6 h-6 text-yellow-500" />
          </ListItemIcon>
          <ListItemText>Accounteinstellungen</ListItemText>
        </MenuItem>
        {showPushSetup && (
          <MenuItem
            onClick={handleNotificationSetup}
            className="text-yellow-500"
          >
            <ListItemIcon>
              <BiBellPlus className="w-6 h-6 text-yellow-500" />
            </ListItemIcon>
            <ListItemText>Benachrichtigungen aktivieren</ListItemText>
          </MenuItem>
        )}
        {showPushUpdate && (
          <MenuItem
            onClick={handleNotificationUpdate}
            className="text-yellow-500"
          >
            <ListItemIcon>
              <BiBell className="w-6 h-6 text-yellow-500" />
            </ListItemIcon>
            <ListItemText>Benachrichtigungen update</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
