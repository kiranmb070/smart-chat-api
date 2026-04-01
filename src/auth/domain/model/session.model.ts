import { v4 as uuidv4 } from 'uuid';

export class Sessions {
  constructor(
    public id: string,
    public userId: string,
    public accesToken: string,
    public refreshToken: string,
    public createdAt: Date,
    public expiresAt?: Date,
    public ipAddress?: string,
    public userAgent?: string,
  ) {}

  static create(deatils: {
    userId: string;
    accessToken: string;
    refreshToken: string;
    ipAddress?: string;
  }): Sessions {
    return new Sessions(
      uuidv4(),
      deatils.userId,
      deatils.accessToken,
      deatils.refreshToken,
      new Date(),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deatils.ipAddress,
    );
  }

  static ofExisting(data: {
    id: string;
    userId: string;
    accestoken: string;
    refreshToken: string;
    createdAt: Date;
    expiresAt?: Date;
    ipAddress?: string;
    userAgent?: string;
  }): Sessions {
    return new Sessions(
      data.id,
      data.userId,
      data.accestoken,
      data.refreshToken,
      data.createdAt,
      data.expiresAt,
      data.ipAddress,
      data.userAgent,
    );
  }
}
