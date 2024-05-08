import { permission } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { UserLogged } from '../utils/userLogged';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private roles: string[] = []; // Roles of the current user
  private permissions: string[] = []; // Permission of the current user

  constructor() {}
  hasRole(requiredRoles: string[]): boolean {
    let userLogged: UserLogged = new UserLogged();
    // Initialize roles for the user
    this.roles = userLogged.getRoles();
    const requiredTrimmed = requiredRoles.map((role) =>
      role.trim().toLowerCase()
    );
    return this.roles.some((role) => requiredTrimmed.includes(role));
  }

  // hasPermission(
  //   requiredPermissions: any,
  //   routeKey: string,
  //   action: string
  // ): boolean {
  //   let userLogged: UserLogged = new UserLogged();
  //   // Initialize permissions for the user
  //   this.permissions = userLogged.getPermissions();

  //   const requiresPer = requiredPermissions.find((item: any) => {
  //     return item.name === routeKey;
  //   });

  //   return this.permissions.includes(requiresPer.permission[action]);
  // }
  // hasPermission1(
  //   requiredPermissions: any,
  //   routeKey: string,
  //   action: string
  // ): boolean {
  //   let userLogged: UserLogged = new UserLogged();
  //   // Initialize permissions from the user
  //   const permissions = userLogged.getPermissions1();
  //   // console.log('permissions', permissions);
  //   // Find the required permission of route
  //   const requiresPer = requiredPermissions.find((item: any) => {
  //     return item.name === routeKey;
  //   });
  //   // console.log('requiresPer', requiresPer);
  //   return permissions.some((permission: any) => {
  //     try {
  //       const des = JSON.parse(permission.Description);
  //       return (
  //         des.RouteName === requiresPer.name &&
  //         des.Permission ===
  //           requiresPer.permission.find((item: string) => item === action)
  //       );
  //     } catch (error) {
  //       return false;
  //     }
  //   });
  //   return permissions.includes(requiresPer.permissions[action]);
  // }
}
