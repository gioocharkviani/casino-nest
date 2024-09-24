import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserService {
    
    //GET CURRENT USER
    async getCurrentUser(req:Request){
        const token = req.headers.authorization;
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        // Prepare headers
        const headers = {
            Authorization: ` ${token}`,
            Accept: 'application/json',
        };

        // Make the API request using fetch
        const response = await fetch('http://62.169.17.152:8010/api/user', {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
    //GET CURRENT USER

}
