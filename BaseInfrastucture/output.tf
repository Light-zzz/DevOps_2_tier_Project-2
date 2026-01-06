output "AppVM" {
description = "Public IP of Application VM"
value = aws_instance.AppVM.public_ip
}
output "AppVM_Instance_ID" {
value = aws_instance.AppVM.id
}
output "vpc_id" {
value = aws_vpc.main.id
}
