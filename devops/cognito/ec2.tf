resource "aws_key_pair" "admin_dev_key" {
  key_name   = "admin-key"
  public_key = var.SSH_PUBLIC_KEY
}

resource "aws_instance" "web" {
  ami           = "ami-0e1bed4f06a3b463d"
  instance_type = "t2.micro"

  key_name        = aws_key_pair.admin_dev_key.key_name
  security_groups = [aws_security_group.http_server_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              # Update the system and install necessary packages
              sudo apt update -y
              sudo apt upgrade -y

              # Install NGINX
              sudo apt install -y nginx
              sudo systemctl start nginx
              sudo systemctl enable nginx

              EOF

  disable_api_termination = true
  disable_api_stop        = true
}

resource "aws_security_group" "http_server_sg" {
  name        = "http_server_sg"
  description = "Allow HTTP and SSH access"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
