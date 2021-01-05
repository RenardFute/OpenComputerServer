--
-- Created by IntelliJ IDEA.
-- User: axele
-- Date: 05/01/2021
-- Time: 14:55
--

function string.starts(String,Start)
    return string.sub(String,1,string.len(Start))==Start
end

local host, port = "4.tcp.ngrok.io", 11205
local internet = require("internet")
local handle = internet.open(host, port)
local label = "SERVER_AE"
local os = require("os")

function recive()
    local response = handle:read()
    handle:flush()
    return response
end

function send(message)
    handle:write(message .. "\r\n")
    handle:flush()
end

function file_exist(file)
    local f = io.open(file, "rb")
    if f then f:close() end
    return f ~= nil

end

function getLine(file)
    local lines = ""
    for line in io.lines(file) do
        lines = lines .. line .. "\r\n"
    end

    lines = string.sub(lines, 0, string.len(lines)-2)

    return lines
end

if(con) then
    print("Succesfully connected to: " .. host .. ":" .. port)
end

while(true) do
    local reicived = recive()
    if(tostring(reicived) == "ID") then
        send("ID: " .. label)
    else if(string.starts(tostring(reicived), "exec")) then
        local result = "output.txt"
        local cmd = io.popen(string.gsub(tostring(reicived), "exec ", "") .. ">" ..  result)
        cmd:close()
        local line_result = getLine(result)
        send("rs: " .. line_result)
    end
    end
    os.sleep(0)
end