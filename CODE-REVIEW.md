Frontend Code Review
====================

## Date: 08/06/2015
  - **Branch**: dev
  - **Reviewed by**: Liem Huynh
  - **Status**: Open
  - **Fixed by**: Hang Trieu

### File: style.css
  - Line 57: Only use `display: inline-block` or `float`

  ```
    .btn-viewmore {
      display: inline-block;
      font: 0/0 a;
      float: right;
    }
  ```

  - Line 95: Outline should only be modified using :focus

  - Line 148, 151: Avoid `!important`
