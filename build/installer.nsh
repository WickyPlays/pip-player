!macro customWelcomePage
  !insertMacro MUI_PAGE_WELCOME
!macroend

!macro customInstall
  WriteRegStr HKCR "pipplayer" "" "URL:PIP-Player Protocol"
  WriteRegStr HKCR "pipplayer" "URL Protocol" ""
  WriteRegStr HKCR "pipplayer\shell\open\command" "" '"$INSTDIR\PIP-Player.exe" "%1"'
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "pipplayer\shell\open\command"
  DeleteRegKey HKCR "pipplayer\shell\open"
  DeleteRegKey HKCR "pipplayer\shell"
  DeleteRegKey HKCR "pipplayer"
!macroend
