import React from "react";

interface TechLogoProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

const TechLogo: React.FC<TechLogoProps> = ({ name, color, size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const getLogoPath = (techName: string): string => {
    const logoMap: { [key: string]: string } = {
      // Frontend
      "React": "/tech-logos/react.svg",
      "Next.js": "/tech-logos/nextjs.svg",
      "Vue": "/tech-logos/vue.svg",
      "Angular": "/tech-logos/angular.svg",
      "Svelte": "/tech-logos/svelte.svg",
      "Flutter": "/tech-logos/flutter.svg",
      "Swift": "/tech-logos/swift.svg",
      "Kotlin": "/tech-logos/kotlin.svg",
      
      // Backend
      "Node.js": "/tech-logos/nodejs.svg",
      "Python": "/tech-logos/python.svg",
      "Django": "/tech-logos/django.svg",
      "Ruby on Rails": "/tech-logos/rails.svg",
      "Laravel": "/tech-logos/laravel.svg",
      "PHP": "/tech-logos/php.svg",
      "Java": "/tech-logos/java.svg",
      "Go": "/tech-logos/go.svg",
      "Rust": "/tech-logos/rust.svg",
      "C#": "/tech-logos/csharp.svg",
      ".NET": "/tech-logos/dotnet.svg",
      
      // Database
      "PostgreSQL": "/tech-logos/postgresql.svg",
      "MongoDB": "/tech-logos/mongodb.svg",
      "MySQL": "/tech-logos/mysql.svg",
      "Redis": "/tech-logos/redis.svg",
      "SQLite": "/tech-logos/sqlite.svg",
      "Elasticsearch": "/tech-logos/elasticsearch.svg",
      
      // Cloud
      "AWS": "/tech-logos/aws.svg",
      "Google Cloud": "/tech-logos/gcp.svg",
      "Azure": "/tech-logos/azure.svg",
      "DigitalOcean": "/tech-logos/digitalocean.svg",
      "Heroku": "/tech-logos/heroku.svg",
      "Vercel": "/tech-logos/vercel.svg",
      "Netlify": "/tech-logos/netlify.svg",
      "Cloudflare": "/tech-logos/cloudflare.svg",
      "Firebase": "/tech-logos/firebase.svg",
      "Supabase": "/tech-logos/supabase.svg",
      
      // DevOps
      "Docker": "/tech-logos/docker.svg",
      "Kubernetes": "/tech-logos/kubernetes.svg",
      "GitHub": "/tech-logos/github.svg",
      "GitLab": "/tech-logos/gitlab.svg",
      "Bitbucket": "/tech-logos/bitbucket.svg",
      "Jenkins": "/tech-logos/jenkins.svg",
      "Terraform": "/tech-logos/terraform.svg",
      "Ansible": "/tech-logos/ansible.svg",
      
      // Tools
      "VS Code": "/tech-logos/vscode.svg",
      "Figma": "/tech-logos/figma.svg",
      "Slack": "/tech-logos/slack.svg",
      "Jira": "/tech-logos/jira.svg",
      "Notion": "/tech-logos/notion.svg",
      "Stripe": "/tech-logos/stripe.svg",
      "OpenAI": "/tech-logos/openai.svg",
      "TensorFlow": "/tech-logos/tensorflow.svg",
      "GraphQL": "/tech-logos/graphql.svg",
      "Nginx": "/tech-logos/nginx.svg",
      "Apache": "/tech-logos/apache.svg"
    };
    
    return logoMap[techName] || "";
  };

  const logoPath = getLogoPath(name);

  if (logoPath) {
    return (
      <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
        <img
          src={logoPath}
          alt={`${name} logo`}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to text if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <span className={`hidden font-bold text-xs ${color} whitespace-nowrap`}>
          {name}
        </span>
      </div>
    );
  }

  // Fallback to text for technologies without logos
  return (
    <span className={`font-bold text-xs ${color} whitespace-nowrap`}>
      {name}
    </span>
  );
};

export default TechLogo;
