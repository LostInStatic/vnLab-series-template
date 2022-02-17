import styled, { css } from "styled-components"
import { devices } from "~styles/breakpoints"

export const TextButton = styled.button`
  ${({ theme: { palette, spacing } }) => css`
    display: flex;
    align-items: center;

    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border: none;
    border-radius: 0;
    text-transform: uppercase;
    background-color: ${palette.black};
    padding: 0;
    z-index: 12;
    width: -webkit-fill-available;
    width: 100%;
    cursor: pointer;

    @media ${devices.tablet} {
      flex-direction: column;
      transform: rotate(180deg);
      top: 0px;
      left: initial;
      bottom: initial;
      width: fit-content;
    }
  `};
`

export const VerticalText = styled.p`
  ${({ theme: { spacing, palette, typography } }) => css`
    color: ${palette.white};
    font-weight: 500;
    font-size: ${typography.sm};
    letter-spacing: 0.55px;
    font-family: ${typography.fonts.primary};
    padding: ${spacing.xxs};
    flex: 1 0 auto;

    margin-left: calc(${spacing.xs} + 11px);

    @media ${devices.tablet} {
      margin-left: 0;
      padding: ${spacing.xs};
      width: fit-content;
      writing-mode: vertical-lr;
      text-orientation: mixed;
    }
  `};
`

export const IconButton = styled.button<{ left: boolean }>`
  ${({ left, theme: { spacing } }) => css`
    z-index: 12;
    position: fixed;
    background: none;
    border: none;
    padding: ${spacing.xxs};
    bottom: ${spacing.xxs};
    ${left ? `left: ${spacing.xs}` : `right: ${spacing.xs}`};

    cursor: pointer;

    @media ${devices.tablet} {
      bottom: initial;
      top: ${spacing.sm};
    }

    img {
      height: 32px;

      @media ${devices.desktop} {
        height: 48px;
      }
    }
  `};
`

export const CloseBtn = styled.img`
  height: 11px;
  width: 11px;
  filter: brightness(10);
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing.xs};

  @media ${devices.tablet} {
    margin-right: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`
