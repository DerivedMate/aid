#!/usr/bin/python3
import sys
import os
import re
import platform
import subprocess as sp

def run_bash(cmd):
  cs = cmd.strip().splitlines()
  code = 0
  for c in cs:
    if code != 0:
      return False

    try:
      s = sp.run(
        c.split(),
        text=True,
        stdout=sp.PIPE,
        check=True
        )
      print(s.stdout)
      code = s.returncode
    except:
      print("Sigue haciendo lo que haces")

  return code
  

def create(paths):
  cmd =             f"""openssl genrsa -out {paths['key']} 2048
                    openssl req -new -days 3650 -key {paths['key']} -out {paths['pem']} -config {paths['cnf_ca']}
                    openssl x509 -req -days 3650 -in {paths['pem']} -signkey {paths['key']} -out {paths['crt']} -extfile {paths['v3_ca']}"""
  return run_bash(cmd)                    

def create_ca(paths):
  cmd =             f"""
                    openssl req -new -sha256 -nodes -out {paths['server_csr']} -newkey rsa:2048 -keyout {paths['server_key']} -config {paths['cnf_cert']}
                    openssl x509 -req -in {paths['server_csr']} -CA {paths['pem']} -CAkey {paths['key']} -CAcreateserial -out {paths['server_crt']} -days 3650 -sha256 -extfile {paths['v3_cert']}"""
  return run_bash(cmd)

def gen_certs():
  print('generating certificates')
  paths = dict(
    crt        = './scripts/rootCA.crt',
    key        = './scripts/rootCA.key',
    pem        = './scripts/rootCA.pem',
    cnf_ca     = './scripts/openssl-ca.cnf',
    cnf_cert   = './scripts/openssl-cert.cnf',
    v3_ca      = './scripts/v3-ca.ext',
    v3_cert    = './scripts/v3-cert.ext',
    server_csr = './scripts/server.csr',
    server_crt = './scripts/server.crt',
    server_key = './scripts/server.key'
  )
  r0 = create(paths) == 0
  r1 = create_ca(paths) == 0
  if r0 and r1:
    print(f"Add the following to .env:\nCRT_PATH={paths['crt']}\nKEY_PATH={paths['key']}")
  else:
    print("Error generating certificates")

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
