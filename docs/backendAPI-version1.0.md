新增路由：

- post api/auth/password

changePassword

鉴权：必须

返回：
```
success: true
message: 修改密码成功
data: null
code: 200
```

- delete api/auth/delete

deleteAccount

请求体: Body: { "password": ... }

鉴权：必须

返回：
```
success: true
message: 删除账号成功
data: null
code: 200
```


