
---
title: Linux Cheatsheet
date: 2025-11-14
---

## Commands

```  bash

ls
pwd 
cd 
mkdir 
rmdir 
rm 
rm -r 
cp 
mv 

cat
less 
head 
tail 

chmod <permissions> <file> # Change file permissions
chown <user>:<group> <file> # Change file ownership

## Process Management
ps # Show running processes
top # Display system resource usage
kill <PID>
pkill <process_name> 

## System Information
uname -a # Show system details
df -h # Display disk usage
free -m # Check memory usage

## Networking Commands
ping <host> # Check network connectivity
ifconfig / ip addr show # View network interfaces
netstat -tulnp # Show active network connections
curl <URL> 

man <command> # Show manual for a command
info <command> # View detailed documentation
<command> --help 
whatis <command> # One-line command summary
apropos <keyword> # Find commands related to a keyword
which <command> # Show full command path

## File Compression and Archival
tar -cvf archive.tar file1 file2 directory/ # Create an archive without compression
tar -xvf archive.tar # Extract an archive
tar -tvf archive.tar # List contents of an archive
gzip file.txt # Compress a file using gzip
gunzip file.txt.gz # Decompress a gzip file
bzip2 file.txt # Compress a file using bzip2
bunzip2 file.txt.bz2 # Decompress a bzip2 file
xz file.txt # Compress a file using xz
unxz file.txt.xz # Decompress an xz file
zip archive.zip file1 file2 directory/ # Create a zip archive
unzip archive.zip # Extract a zip archive

## File and Pattern Searching
find /home -name "file.txt" # Find a file by name
find / -size +100M # Find files larger than 100MB
find /var/log -name "*.log" # Find all .log files
grep "error" /var/log/syslog # Find a pattern in a file
grep -i "warning" /var/log/syslog # Case-insensitive search
grep -r "TODO" /home/user/projects/ # Recursive search in a directory
grep -n "failed" /var/log/auth.log # Show line numbers for matches
locate bashrc # Find files using locate
sudo updatedb # Update the locate database

## I/O Redirection
ls > output.txt # Redirect stdout to a file (overwrite)
ls >> output.txt # Redirect stdout to a file (append)
ls non_existing_file 2> error.txt # Redirect stderr to a file
ls non_existing_file > output.txt 2>&1 # Redirect both stdout and stderr
command 2>/dev/null # Suppress error messages
sort < unsorted.txt # Read from a file instead of standard input
cat file.txt | wc -l # Count lines in a file using pipe


## System Management
systemctl start myservice # Start a service
systemctl stop myservice # Stop a service
systemctl restart myservice # Restart a service
systemctl reload myservice # Reload a service
systemctl enable myservice # Enable at boot
systemctl disable myservice # Disable at boot
systemctl status myservice # Check service status
journalctl -u myservice # View service logs
systemctl list-units --type=service # List all active services
systemctl list-unit-files --type=service # List all installed services

## Storage Management
lsblk # List block devices and partitions
fdisk -l # Display partition details
parted -l # Show partition table info
sudo fdisk /dev/sdb # Create a new partition
sudo mkfs.ext4 /dev/sdb1 # Format as ext4
sudo mount /dev/sdb1 /mnt/data # Mount a partition
df -T /mnt/data # Check file system type
lsblk -f # Show file system type of all partitions
sudo mkfs.xfs /dev/sdb1 # Convert to XFS
sudo mkfs.btrfs /dev/sdb1 # Convert to Btrfs

## LVM Commands
sudo pvcreate /dev/sdb # Initialize the Physical Volume
sudo vgcreate my_vg /dev/sdb # Create a Volume Group
sudo lvcreate -L 10G -n my_lv my_vg # Create a Logical Volume
sudo lvextend -L +5G /dev/my_vg/my_lv # Increase LVM Size
sudo resize2fs /dev/my_vg/my_lv # Resize file system
sudo lvreduce -L -5G /dev/my_vg/my_lv # Reduce LVM Size
sudo lvcreate -L 1G -s -n my_snapshot /dev/my_vg/my_lv # Create a Snapshot
sudo lvconvert --merge /dev/my_vg/my_snapshot # Restore from a Snapshot
sudo pvs # Show Physical Volumes
sudo vgs # Show Volume Groups
sudo lvs # Show Logical Volumes

## NFS Commands
sudo mount -t nfs 192.168.1.100:/shared_folder /mnt/nas # Mount a NAS Share via NFS
showmount -e 192.168.1.100 # Show available NFS shares
systemctl status nfs-server # Check NFS service status

## Security Commands
last # Show last logins
who # Show logged-in users
ps aux --sort=-%mem # Find processes using high memory
netstat -tulnp # Check open ports
whoami # Show current user
id user1 # Show user ID and group ID
cat /etc/passwd # List all users
sudo useradd -m user1 # Create a new user
sudo passwd user1 # Set a password for the user
sudo usermod -aG sudo user1 # Add a user to a group
sudo userdel -r user1 # Delete a user
sudo groupadd developers # Create a new group
sudo usermod -aG developers user1 # Add a user to a group
sudo gpasswd -d user1 developers # Remove a user from a group
ssh user@remote-server # Secure remote login
scp file.txt user@remote-server:/home/user/ # Copy file to a remote server
scp user@remote-server:/home/user/file.txt . # Copy file from a remote server
sudo iptables -L -v # List current firewall rules
sudo iptables -A INPUT -s 192.168.1.10 -j DROP # Block an IP address
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT # Allow SSH (port 22)
sudo iptables-save > /etc/iptables.rules # Save firewall rules
crontab -e # Edit cron jobs
crontab -l # List scheduled jobs
crontab -r # Remove all cron jobs

#create systemlinks
ln -s /usr/bin/batcat ~/bin/bat
# now both batcat and bat work

lsmod   # gives you all of the modules that are installed into your system
rmmod lp    # removes the module you want to remove 
modprobe lp # loads the module to the top of the list 
/lib/modules/   # contains the modules that we have 
```

## Resources 

- [The Linux Kernel Module Programming Guide](https://sysprog21.github.io/lkmpg/) 
- [Linux Productivity Tools pdf](https://www.usenix.org/sites/default/files/conference/protected-files/lisa19_maheshwari.pdf) 

- [Linux Terminal Tools pdf](https://ketancmaheshwari.github.io/pdfs/LPT_LISA.pdf) 

- [Brendan's Linux guide](https://www.brendangregg.com/overview.html)
    - looks like a bible maybe explore later on.


- [farhanashrafdev/TheUltimateDevOpsBible-ZeroToHero/cheatsheets/linux.md](https://github.com/farhanashrafdev/TheUltimateDevOpsBible-ZeroToHero/blob/main/CheatSheets/linux.md)