NAMESPACE=$1
CONFIG_FILE=$2

echo "Replacing namespace: $1 in file: $2"
sed -i "s/{NAMESPACE}/$NAMESPACE/g" "$CONFIG_FILE" 
