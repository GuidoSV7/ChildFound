import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigType } from '@nestjs/config';
import facebookOauthConfig from '../facebook-oauth.config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject(facebookOauthConfig.KEY)
    private readonly facebookConfig: ConfigType<typeof facebookOauthConfig>,
  ) {
    super({
      clientID: facebookConfig.appId,
      clientSecret: facebookConfig.appSecret,
      callbackURL: facebookConfig.callbackURL,
      profileFields: ['id', 'displayName', 'emails', 'name', 'picture.type(large)'],
      scope: ['email', 'public_profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const primaryEmail = (profile.emails && profile.emails[0]?.value) || undefined;
    const user = {
      facebookId: profile.id,
      email: primaryEmail,
      name: profile.displayName,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}


