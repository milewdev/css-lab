VAGRANTFILE_API_VERSION   = "2"
PROJECT_SOURCE_URL        = "https://github.com/milewgit/css-lab.git"
PROJECT_VM_PATH           = "/Users/vagrant/Documents/css-lab"
FORWARDED_PORT            = { guest: 4000, host: 4000 }
PROVIDER                  = "vmware_fusion"
BOX                       = "OSX109"


Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  setup_box                       config
  setup_provider                  config
  setup_forwarded_port            config  # access web server on vm via host port
  setup_synced_folder             config  # easy way to copy gpg keys and git config from host to vm
  install_osx_command_line_tools  config  # needed by git
  install_gpg                     config  # needed in order to sign git commits
  install_git                     config  # source is on github
  install_git_gui                 config  # sometimes gui diff is handy
  install_bundler                 config  # recommended for gh-pages
  install_editor                  config
  install_project_source_code     config
  install_project_dependencies    config
  reboot_vm                       config
end


def setup_box(config)
  config.vm.box = BOX
end


def setup_provider(config)
  config.vm.provider(PROVIDER) do |vb|
    vb.gui = true
  end
end


def setup_forwarded_port(config)
  config.vm.network "forwarded_port", guest: FORWARDED_PORT[:guest], host: FORWARDED_PORT[:host]
end


def setup_synced_folder(config)
  config.vm.synced_folder "~/", "/.vagrant_host_home"
end


def install_osx_command_line_tools(config)
  say config, "Installing OS X command line tools"
  install_dmg config, 
    'https://s3.amazonaws.com/OHSNAP/command_line_tools_os_x_mavericks_for_xcode__late_october_2013.dmg', 
    'Command Line Developer Tools',
    'Command Line Tools (OS X 10.9).pkg'
end


def install_gpg(config)  
  say config, "Installing gpg, gpg-agent, and copying gpg keys from vm host"
  install_dmg config,
    'https://releases.gpgtools.org/GPG%20Suite%20-%202013.10.22.dmg',
    'GPG Suite', 
    'Install.pkg'
  run_script config, <<-'EOF'
    sudo rm -rf /Users/vagrant/.gnupg
    sudo rsync -r --exclude '.gnupg/S.gpg-agent' /.vagrant_host_home/.gnupg /Users/vagrant
    sudo chown -R vagrant /Users/vagrant/.gnupg
  EOF
end


def install_git(config)
  say config, "Installing git and copying .gitconfig from vm host"
  install_dmg config,
    'https://git-osx-installer.googlecode.com/files/git-1.8.4.2-intel-universal-snow-leopard.dmg',
    'Git 1.8.4.2 Snow Leopard Intel Universal',
    'git-1.8.4.2-intel-universal-snow-leopard.pkg'
  run_script config, "cp /.vagrant_host_home/.gitconfig /Users/vagrant/.gitconfig"
end


def install_git_gui(config)
  say config, "Installing GitHub for Mac"
  run_script config, "curl -fsSL https://central.github.com/mac/latest | sudo tar -x -C /Applications -f -"
end


def install_bundler(config)
  say config, "Installing bundler"
  run_script config, "sudo gem install bundler"
end


def install_editor(config)
  say config, "Installing editor (TextMate)"
  run_script config, "curl -fsSL https://api.textmate.org/downloads/release | sudo tar -x -C /Applications -f -"
end


def install_project_source_code(config)
  say config, "Installing project source code"
  run_script config, "git clone #{PROJECT_SOURCE_URL} #{PROJECT_VM_PATH}"
end


def install_project_dependencies(config)
  say config, "Install project dependencies"
  run_script config, "( cd #{PROJECT_VM_PATH} && exec sudo bundle install )"
end


def reboot_vm(config)
  say config, "Rebooting"
  run_script config, "sudo reboot"
end


#
# general utilities
#

def install_dmg(config, url, path, pkg)
  path = '/Volumes/' + escape_shell_special_chars(path)
  pkg = escape_shell_special_chars(pkg)
  run_script config, <<-"EOF"
    curl -o vm_install.dmg #{url}
    hdiutil attach vm_install.dmg
    sudo installer -pkg #{path}/#{pkg} -target /
    hdiutil detach #{path}
    rm -f vm_install.dmg
  EOF
end


def install_pkg(config, url)
  run_script config, <<-"EOF"
    curl -o vm_install.pkg #{url}
    sudo installer -pkg vm_install.pkg -target /
    rm -f vm_install.pkg
  EOF
end


def escape_shell_special_chars(string)
  string.gsub(/([ ()])/, '\\\\\1')        # 'my product (v1)' => 'my\ product\ \(v1\)'
end


def say(config, message)
  run_script config, "echo '--------------- #{message} ---------------'"
end


def run_script(config, script)
  config.vm.provision :shell, privileged: false, inline: script
end
