#!/usr/bin/python3
import sys
import os
import re
import platform

def gen_certs():
  print('generating certificates')
  crt_path = 'server.crt'
  key_path = 'server.key'

  os.system(f"openssl genrsa -aes256 -passout pass:gsahdg -out server.pass.key 4096 && openssl rsa -passin pass:gsahdg -in server.pass.key -out {key_path} && rm server.pass.key && openssl req -new -key {key_path} -out server.csr && openssl x509 -req -sha256 -days 365 -in server.csr -signkey {key_path} -out {crt_path}")

  print(f'Add the following to .env:\nCRT_PATH=./{crt_path}\nKEY_PATH=./{key_path}')


def main():
  # os info
  os_type = platform.system()

  # check if openssl is installed
  which = os.popen('which openssl')
  which_out = which.read()
  which.close()

  is_installed = which_out != ''
  if is_installed:
    print("openssl already installed")
    return gen_certs()
  
  # install openssl
  cmd = ''
  if os_type == 'Darwin':
    cmd = 'brew install openssl'
  elif os_type == 'Linux':
    cmd = 'apt-get install openssl -y'
  else:
    print('unsupported os type, aborting')
    return
  
  succeeded = os.system(cmd) == 0
  if succeeded:
    print('openssl successfully installed')
    return gen_certs()
  else:
    print('openssl installation failed. Aborting generation')

if __name__ == '__main__':
  main()
