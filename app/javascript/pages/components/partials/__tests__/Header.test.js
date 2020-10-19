/* eslint-disable no-undef */
import { handleActivePage } from '../Header';

describe('Header navigation', () => {
  test('displays no active links on the homepage', () => {
    expect(handleActivePage('/')).toBeNull();
  });

  test('displays the correct link as active if it matches the beginning of the path location', () => {
    expect(handleActivePage('/browser/datasets/170', '/browser')).toBe('active');
  });

  test('displays Gallery as active if on a calendar visualization', () => {
    expect(handleActivePage('/calendar/2020/january', '/gallery')).toBe('active');
  });

  test('displays inactive link for other non-matching path locations and links', () => {
    expect(handleActivePage('/browser', '/profile')).toBeNull();
  });
});
