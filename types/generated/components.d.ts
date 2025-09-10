import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_advantages';
  info: {
    displayName: 'advantage';
  };
  attributes: {
    desc: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      ['Shield', 'Truck', 'Layers', 'ShoppingBag']
    >;
    tittle: Schema.Attribute.String;
  };
}

export interface BlocksDeposit extends Struct.ComponentSchema {
  collectionName: 'components_blocks_deposits';
  info: {
    displayName: 'deposit';
  };
  attributes: {
    cta: Schema.Attribute.String;
    text: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    gallery: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    primaryCta: Schema.Attribute.String;
    rightBadge: Schema.Attribute.String;
    secondaryCta: Schema.Attribute.String;
    subtitleAccent: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface BlocksLead extends Struct.ComponentSchema {
  collectionName: 'components_blocks_leads';
  info: {
    displayName: 'Lead';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'common.bullet', true>;
    bulletsTitle: Schema.Attribute.String;
    cta: Schema.Attribute.String;
    legal: Schema.Attribute.RichText;
    placeholder: Schema.Attribute.String;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface CommonBullet extends Struct.ComponentSchema {
  collectionName: 'components_common_bullets';
  info: {
    displayName: 'Bullet';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CommonSeo extends Struct.ComponentSchema {
  collectionName: 'components_common_seos';
  info: {
    displayName: 'seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    metaTitle: Schema.Attribute.String;
  };
}

export interface ShopFrameSpecs extends Struct.ComponentSchema {
  collectionName: 'components_shop_frame_specs';
  info: {
    displayName: 'frame-specs';
  };
  attributes: {
    bridge: Schema.Attribute.Integer;
    eye: Schema.Attribute.Integer;
    gender: Schema.Attribute.Enumeration<['men', 'women']>;
    material: Schema.Attribute.String;
    temple: Schema.Attribute.Integer;
  };
}

export interface ShopPriceTier extends Struct.ComponentSchema {
  collectionName: 'components_shop_price_tiers';
  info: {
    displayName: 'price-tier';
  };
  attributes: {
    minQty: Schema.Attribute.Integer;
    priceHT: Schema.Attribute.Decimal;
    tierName: Schema.Attribute.Enumeration<
      ['Starter', 'Pro', 'Premium', 'ALaCarte']
    >;
  };
}

export interface ShopVariant extends Struct.ComponentSchema {
  collectionName: 'components_shop_variants';
  info: {
    displayName: 'variant';
  };
  attributes: {
    color: Schema.Attribute.String;
    ean: Schema.Attribute.String;
    size: Schema.Attribute.String;
    stockQty: Schema.Attribute.Integer;
    variantSku: Schema.Attribute.String;
    variantStatus: Schema.Attribute.Enumeration<
      ['active', 'draft', 'archived']
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.advantage': BlocksAdvantage;
      'blocks.deposit': BlocksDeposit;
      'blocks.hero': BlocksHero;
      'blocks.lead': BlocksLead;
      'common.bullet': CommonBullet;
      'common.seo': CommonSeo;
      'shop.frame-specs': ShopFrameSpecs;
      'shop.price-tier': ShopPriceTier;
      'shop.variant': ShopVariant;
    }
  }
}
