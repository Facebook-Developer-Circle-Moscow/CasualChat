module.exports = ({
  title,
  description,
  keywords,
  author,
  images,
  videos,
  audios,
  modified,
  domain,
  locale,
  siteName
}) => {
  const result = [];

  if (title) {
    result.push(`<title>${title}</title>`);
  }

  if (description) {
    result.push(`<meta name="description" content="${description}"/>`);
  }

  if (keywords) {
    result.push(`<meta name="keywords" content="${keywords}"/>`);
  }

  if (modified) {
    result.push(`<meta last-modified="${modified}"/>`);
  }

  if (author) {
    result.push(`<meta name="author" content="${author.name}"/>`);
  }

  if (title) {
    result.push(`<meta property="og:title" content="${title}"/>`);
  }

  if (description) {
    result.push(`<meta property="og:description" content="${description}"/>`);
  }

  if (domain) {
    result.push('<meta property="og:type" content="website"/>');
    result.push(`<meta property="og:url" content="${domain}"/>`);
  }

  if (locale) {
    result.push(`<meta property="og:locale" content="${locale}"/>`);
  }

  if (siteName) {
    result.push(`<meta property="og:site_name" content="${siteName}"/>`);
  }

  if (modified) {
    result.push(`<meta property="og:updated_time" content="${modified}"/>`);
  }

  if (images) {
    for (const {src, type, width, height, alt} of images) {
      result.push(`<meta property="og:image" content="${src}"/>`);
      result.push(`<meta property="og:image:type" content="${type}"/>`);
      result.push(`<meta property="og:image:width" content="${width}"/>`);
      result.push(`<meta property="og:image:height" content="${height}"/>`);
      result.push(`<meta property="og:image:alt" content="${alt}"/>`);
    }
  }

  if (videos) {
    for (const {src, type, width, height} of videos) {
      result.push(`<meta property="og:video" content="${src}"/>`);
      result.push(`<meta property="og:video:type" content="${type}"/>`);
      result.push(`<meta property="og:video:width" content="${width}"/>`);
      result.push(`<meta property="og:video:height" content="${height}"/>`);
    }
  }

  if (audios) {
    for (const {src, type} of audios) {
      result.push(`<meta property="og:audios" content="${src}"/>`);
      result.push(`<meta property="og:audios:type" content="${type}"/>`);
    }
  }

  return result.join('\r\n');
};
