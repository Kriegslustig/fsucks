# fsucks

Because all sftp clients kinda suck. #marketing

```vimL
map <leader>u :call Fsucks()<cr>
fu! Fsucks ()
  w!
  execute("!~/Software/nodejs/fsucks/index.js put ".bufname(''))
endfunction

```

